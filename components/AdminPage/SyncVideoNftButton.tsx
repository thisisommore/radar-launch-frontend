import { CacheKey } from '@/constants/react-query';
import { getEditionMetadata } from '@/lib/backend';
import { ProjectWithChainData } from '@/types/web3';
import { useUpdateAsset } from '@livepeer/react';
import { useQuery } from 'wagmi';
import { Button } from '../ui/button';

export function SyncVideoNftButton({
  video_id,
  title,
  editionId,
}: ProjectWithChainData) {
  const { data } = useQuery(
    [CacheKey.METADATA],
    () => getEditionMetadata(editionId),
    {
      enabled: editionId !== undefined,
    },
  );
  const { mutate } = useUpdateAsset({
    assetId: video_id!,
    name: title,
    storage: {
      metadata: data,
    },
  });

  return (
    <Button
      onClick={() => {
        mutate?.();
      }}
      disabled={mutate === undefined || video_id === undefined}
    >
      Sync IPFS Metadata
    </Button>
  );
}
