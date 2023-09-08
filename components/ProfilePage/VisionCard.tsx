import { CONTRACT_ADDRESS } from '@/constants/address';
import { generateVideoThumbnail } from '@/lib/generateVideoThumbnail';
import { useRadarEditionsTotalSupply } from '@/lib/generated';
import { cn } from '@/lib/utils';
import { ProjectWithChainData } from '@/pages/profile/[id]';
import Link from 'next/link';
import { formatEther } from 'viem';
import { chains } from '../Providers/Web3Provider';
import { Badge } from '../ui/badge';
import { VisionCardActions } from './VisionCardActions';
import { convertProjectStatusName } from '@/lib/convertProjectStatusName';
import { convertProjectStatusToColour } from '@/lib/convertProjectStatusToColour';

export function VisionCard(props: ProjectWithChainData) {
  const { _id, status, video_url, title, supporter_count, balance, editionId } =
    props;
  const { data: totalSupply } = useRadarEditionsTotalSupply({
    address: CONTRACT_ADDRESS,
    chainId: chains[0]?.id,
    args: [BigInt(Math.max(editionId! || 0, 0))],
    enabled: Boolean(chains[0]?.id) && editionId !== undefined,
  });

  return (
    <div className="col-span-1 p-2">
      <div className="flex items-center justify-between pb-2">
        <p>{convertProjectStatusName(status)}</p>
        <Badge
          variant="none"
          className={cn(convertProjectStatusToColour(status), 'h-3 w-3 p-0')}
        />
      </div>
      <img
        src={generateVideoThumbnail(video_url)}
        alt={title + ' thumbnail'}
        className="w-full aspect-video object-cover"
      />
      <div className="my-4">
        <Link href={`/project/${_id}`} className="hover:opacity-70">
          {title}
        </Link>
      </div>
      <hr className="mb-3" />
      <div className="space-y-2 pb-8">
        <div className="grid grid-cols-2">
          <div className="rounded-lg rounded-r-none border p-3 text-gray-400">
            NFTs Sold
          </div>
          <div className="rounded-lg rounded-l-none border border-l-0 p-3">
            {totalSupply?.toString() || 0}
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="rounded-lg rounded-r-none border p-3 text-gray-400">
            Funding Raised
          </div>
          <div className=" rounded-lg rounded-l-none border border-l-0 p-3">
            {balance !== undefined ? formatEther(balance).slice(0, 9) : 0} ETH
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="rounded-lg rounded-r-none border p-3 text-gray-400">
            Supporters
          </div>
          <div className=" rounded-lg rounded-l-none border border-l-0 p-3">
            {supporter_count}
          </div>
        </div>
        {/* <div className="grid grid-cols-2">
          <div className="border rounded-lg p-3 rounded-r-none text-gray-400">
            Collaborators
          </div>
          <div className="border border-l-0 rounded-lg rounded-l-none p-3">
            0
          </div>
        </div> */}
      </div>
      <VisionCardActions {...props} />
    </div>
  );
}
