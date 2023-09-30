import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { useGetCurrentUser } from '@/hooks/useGetCurrentUser';
import { shortenAddress } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Address, mainnet, useEnsName, useNetwork } from 'wagmi';
import { Button } from '../ui/button';
import { chains } from '@/lib/wagmi';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

export function Wallet() {
  const { linkWallet, user } = usePrivy();
  const { login, logout, isLoggedIn, isLoading } = useAuth();
  const { chain } = useNetwork();
  const { data: ensName } = useEnsName({
    address: user?.wallet?.address as Address,
    chainId: mainnet.id,
    enabled: user?.wallet?.address !== undefined,
  });
  const { data: currentUserData, isLoading: isCurrentUserLoading } =
    useGetCurrentUser();
  const { wallet } = usePrivyWagmi();

  if (!isLoggedIn) {
    return (
      <Button
        onClick={() => {
          login();
        }}
        variant={'ghost'}
        loading={isLoading || isCurrentUserLoading}
      >
        {'LOGIN ⚙'}
      </Button>
    );
  }

  if (!user?.wallet?.address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'}>
            ADD WALLET
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-[200px]">
          <DropdownMenuLabel>
            <p className="pt-2 font-normal leading-4">
              Link a new wallet to your account.
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => linkWallet()}
            className="cursor-pointer"
          >
            Link Wallet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  const shortenedAddress = ensName || shortenAddress(user.wallet.address);
  const address = ensName || user.wallet.address;
  console.log({ chain });
  if (chain !== undefined && chain.id !== chains[0].id) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'}>
            WRONG CHAIN
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-[200px]">
          <DropdownMenuLabel>
            Please switch your network to {chains[0].name} to continue RADAR
            Launch.
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => wallet?.switchChain(chains[0].id)}
            className="cursor-pointer"
          >
            Switch Network
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (currentUserData === undefined) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'}>
            {shortenedAddress}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-[200px]">
          <DropdownMenuLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p>{shortenedAddress}</p>
                </TooltipTrigger>
                <TooltipContent>{address}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="pt-2 font-normal leading-4">
              No user data found, please contact support if issue persists.
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'}>
          {shortenedAddress}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{shortenedAddress}</TooltipTrigger>
              <TooltipContent>{address}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currentUserData?.bypasser && (
          <>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/admin">Admin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/pool/create">Create Pool</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/profile/${currentUserData._id}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/profile/edit`}>Edit Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
