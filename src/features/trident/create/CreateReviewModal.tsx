import React, { FC } from 'react'
import HeadlessUIModal from '../../../components/Modal/HeadlessUIModal'
import Button from '../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { useRecoilState } from 'recoil'
import { showReviewAtom } from '../context/atoms'
import ListPanel from '../../../components/ListPanel'
import Divider from '../../../components/Divider'
import { useIndependentAssetInputs } from '../context/hooks/useIndependentAssetInputs'
import { usePoolDetails } from '../context/hooks/usePoolDetails'
import { useClassicPoolCreateExecute } from '../context/hooks/useClassicPoolCreateExecute'
import { PoolType } from '../types'
import { useSetupPoolProperties } from '../context/hooks/useSetupPoolProperties'

const AddTransactionReviewModal: FC = () => {
  const { i18n } = useLingui()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const {
    parsedAmounts,
    currencies: [selectedPoolCurrencies],
  } = useIndependentAssetInputs()
  const {
    poolType: [selectedPoolType],
  } = useSetupPoolProperties()
  const { execute } = useClassicPoolCreateExecute()
  const { price } = usePoolDetails(parsedAmounts)

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={() => setShowReview(false)}>
      <div className="flex flex-col gap-8 h-full">
        <div className="relative">
          <div className="pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
          <div className="px-5 pt-5 pb-8 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <Button
                color="blue"
                variant="outlined"
                size="sm"
                className="rounded-full py-1 pl-2 cursor-pointer"
                startIcon={<ChevronLeftIcon width={24} height={24} />}
                onClick={() => setShowReview(false)}
              >
                {i18n._(t`Back`)}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="h2" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Pool Creation`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(
                  t`When creating a pool you are the first liquidity provider. The ratio of tokens you add will set the price of this pool.`
                )}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 px-5">
            <Typography weight={700} variant="lg">
              {selectedPoolType === PoolType.ConstantProduct && i18n._(t`You are creating a classic pool with:`)}
              {selectedPoolType === PoolType.Weighted && i18n._(t`You are creating a weighted pool with:`)}
              {selectedPoolType === PoolType.Hybrid && i18n._(t`You are creating a multi-asset pool with:`)}
              {selectedPoolType === PoolType.ConcentratedLiquidity &&
                i18n._(t`You are creating a concentrated liquidity pool with:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.map((amount, index) => (
                <ListPanel.CurrencyAmountItem amount={amount} key={index} />
              ))}
            />
          </div>
        </div>
        <div className="flex flex-col px-5 gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Typography variant="sm">{i18n._(t`Rates:`)}</Typography>
              <Typography variant="sm" className="text-right">
                1 {selectedPoolCurrencies[0]?.symbol} = {price?.toSignificant(6)} {selectedPoolCurrencies[1]?.symbol}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography variant="sm" className="text-right">
                1 {selectedPoolCurrencies[1]?.symbol} = {price?.invert().toSignificant(6)}{' '}
                {selectedPoolCurrencies[0]?.symbol}
              </Typography>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`${selectedPoolCurrencies[0]?.symbol} Deposited:`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                0.00 → {parsedAmounts[0]?.toSignificant(6)} {parsedAmounts[0]?.currency.symbol}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`${selectedPoolCurrencies[1]?.symbol} Deposited:`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                0.00 → {parsedAmounts[1]?.toSignificant(6)} {parsedAmounts[1]?.currency.symbol}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Share of Pool`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                0.00% → <span className="text-green">100%</span>
              </Typography>
            </div>
          </div>
          <Button color="gradient" size="lg" onClick={execute}>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {i18n._(t`Confirm Pool Creation`)}
            </Typography>
          </Button>
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default AddTransactionReviewModal