import { BenefitsFields } from '@/components/CreateProjectPage/BenefitsFields';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface Props {
  isEdit?: boolean;
}

export function CrowdFundSection({ isEdit }: Props) {
  const { control } = useFormContext();
  return (
    <div className="mb-10 rounded border border-slate-200 p-10">
      <h1 className="font-base">Patronage</h1>
      <p className="form-subheading">
        On Launch, the public can support your project with $, do you want to
        choose an edition price and offer optional benefits to inspire people to
        support you?
      </p>
      <hr className="border-b-1 my-8 border-slate-200" />
      {/* <div className="grid grid-cols-2 gap-10">
        <div className="col-span-1 pr-4">
          <h2 className="font-base text-xl">Crowdfunding</h2>
          <p>
            We encourage you to focus on smaller fundraising goals to reach
            impactful milestones, building trust and growing supporters as you
            go, and crowdraise again at any time for new experiments, ideas and
            projects on your journey.
          </p>
        </div>
        <div className="col-span-1">
          <FormField
            control={control}
            name="waitlist"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>
                  I want to set benefits and crowdfund on Launch
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <hr className="border-b-1 my-8 border-slate-200" /> */}
      <div
        className={cn('grid gap-10', isEdit ? 'grid-cols-1' : 'grid-cols-2')}
      >
        {!isEdit && (
          <div className="col-span-1 pr-4">
            <h2 className="font-base text-xl">Editions</h2>
            <p>
              Adding patronage is completely up to you, projects can believe in
              you for free onchain, but additionally they can support you
              financially by collecting your project edition.
              <br />
              <br />
              Setting a free NFT mint will not decrease prize opportunities,
              you&apos;ll just be airdropped to the wallet address you created
              the project with.
              <br />
              <br />
              We recommend setting a low 1$-5$ edition to allow people to
              support you with micro-prizes and allows prizes to be directly
              distributed through the platform.
            </p>
          </div>
        )}
        <div className="col-span-1">
          <FormField
            control={control}
            name="edition_price"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Edition Price</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Input type="number" placeholder="0-20" {...field} />
                  </FormControl>
                  <p>$USD</p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="mint_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mint End Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <hr className="border-b-1 my-8 border-slate-200" />
      <div
        className={cn('grid gap-10', isEdit ? 'grid-cols-1' : 'grid-cols-2')}
      >
        {!isEdit && (
          <div className="col-span-1 pr-4">
            <h2 className="font-base text-xl">
              Optional Benefits for supporters
            </h2>
            <p>
              Set benefits for collectors of your editions, this will be listed
              on your project page.
              <br />
              <br />
              Think of incentives to support you, it could be first access to a
              product, a physical redemption, membership to community.
              <br />
              <br />
              At the current time, you cannot offer equity or revenue share
              through Launch.
            </p>
          </div>
        )}
        <div className="col-span-1">
          <BenefitsFields />
        </div>
      </div>
      <hr className="border-b-1 my-8 border-slate-200" />
      <div
        className={cn('grid gap-10', isEdit ? 'grid-cols-1' : 'grid-cols-2')}
      >
        {!isEdit && (
          <div className="col-span-1 pr-4">
            <h2 className="font-base text-xl">Set your admin address</h2>
            <p>
              Please share an Ethereum address which can withdraw your
              crowdfund, please ensure you have access to this address.
            </p>
          </div>
        )}
        <div className="col-span-1">
          <FormField
            control={control}
            name={`admin_address`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Your ETH / ENS address" />
                </FormControl>
                <FormDescription>This should start with 0x...</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
