import { useEffect } from 'react'
import { RouterProps } from 'react-router'
import { Alert, AlertIcon, AlertTitle, Text } from '@chakra-ui/react'
import { CardContent } from '../../../Atoms/CardContent'
import { PendingIconGroup } from 'Organisims/PendingIconGroup'
import { LpActions, useLp } from 'state/LpProvider'
import { ViewOnChainLink } from 'Molecules/ViewOnChainLink'
import { TxStatus, usePendingTx } from 'hooks/usePendingTx'

export const AddingLiquidity = ({ history }: RouterProps) => {
  const { state: lpState, dispatch } = useLp()
  const hasError = !!lpState?.error
  const pendingState = usePendingTx(lpState.lpTxHash)

  useEffect(() => {
    let ignore = false
    if (pendingState === TxStatus.SUCCESS && !ignore) {
      dispatch({ type: LpActions.SET_TX_HASH, payload: null })
      history.push('/fox-farming/staking')
    }
    if (pendingState === TxStatus.UNKNOWN && !ignore && !lpState.lpTxHash) {
      history.push('/fox-farming/liquidity/add')
    }
    return () => {
      ignore = true
    }
  }, [dispatch, history, lpState.lpTxHash, pendingState])

  return (
    <CardContent maxW='500px'>
      <PendingIconGroup mb={10} mt={8} isLoading={!hasError} />
      <Text mb={4} fontSize='2xl' textAlign='center'>
        Waiting for liquidity...
      </Text>
      <Text color='gray.500' mb={6} textAlign='center'>
        Once we detect your liquidity tokens you can stake them.
      </Text>
      {lpState?.lpTxHash && <ViewOnChainLink txId={lpState.lpTxHash} />}
      {hasError && (
        <Alert status='error' mt={4}>
          <AlertIcon />
          <AlertTitle>
            {lpState?.error?.message
              ? lpState.error.message
              : 'Something went wrong. Please try again'}
          </AlertTitle>
        </Alert>
      )}
    </CardContent>
  )
}
