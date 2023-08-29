import { GrantPoolHome } from '@/components/PoolPage/GrantPoolHome';
import { HeaderHero } from '@/components/HomePage/HeaderHero';
import { InspirationFooter } from '@/components/HomePage/InspirationFooter';
import { Banner } from '@/components/Layout/Banner';
import { ProjectDiv } from '@/components/HomePage/ProjectDiv';
import { Button } from '@/components/ui/button';
import { useGetProjects } from '@/hooks/useGetProjects';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ProjectBlockNoSSR = dynamic(
  () =>
    import('@/components/Layout/ProjectBlock').then((res) => res.ProjectBlock),
  {
    ssr: false,
  },
);

const VisionOfTheWeekProjectNoSSR = dynamic(
  () =>
    import('@/components/HomePage/VisionOfTheWeek').then(
      (res) => res.VisionOfTheWeek,
    ),
  {
    ssr: false,
  },
);

const CENTAUR_PROEJCT_IDS = [
  '64d3ef19d96faeddac76d82b',
  '64d3f328d96faeddac76d848',
  '64d3f928d96faeddac76d86d',
  '64d3fbece93b67e1d4e27671',
];

export default function HomePage() {
  const { data } = useGetProjects();

  return (
    <section>
      <div className="absolute left-0 top-[100px] z-10 w-full overflow-hidden whitespace-nowrap font-bolded text-[200px] font-bold leading-none text-gray-100">
        A MORE PLAYFUL FUTURE
      </div>

      <HeaderHero
        visionOfTheWeekSlot={
          <VisionOfTheWeekProjectNoSSR
            projectId={process.env.FEATURED_PROJECT_ID!}
          />
        }
      />
      <ProjectDiv
        projectSectionTitle="CURATED BY CULTURE3"
        projectSectionDescription="Culture3 spotlights 4 projects building a better future"
        projectSectionButton={
          <Button className="font-bolded font-bold" variant={'ghost'} asChild>
            <Link href="https://culture3.xyz" target="_blank">
              {'GET DROP UPDATES'}
            </Link>
          </Button>
        }
        projects={
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
            {data
              ?.filter(
                (project) =>
                  project.curation?.start &&
                  new Date(project.curation.start) <= new Date() &&
                  // if no curation end date, show it indefinitely
                  (project.curation?.end ||
                    new Date(project.curation.end) >= new Date()),
              )
              // sort by ascending start dates
              .sort(
                (a, b) =>
                  new Date(a.curation.start).getTime() -
                  new Date(b.curation.start).getTime(),
              )
              .slice(0, 4)
              .map((project) => (
                <ProjectBlockNoSSR
                  key={project._id}
                  {...project}
                  showMintEndDate
                  showSupporters
                />
              ))}
          </div>
        }
      />
      <ProjectDiv
        projectSectionTitle="OUR CENTAUR FUTURE"
        projectSectionDescription="Support over 10 weeks of collective discovery, exploration and innovation in Cycle #3"
        projectSectionButton={
          <Button className="font-bolded font-bold" variant={'ghost'} asChild>
            <Link href="https://www.radardao.xyz/patron" target="_blank">
              {'READ MORE'}
            </Link>
          </Button>
        }
        projects={
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
            {data
              ?.filter((project) => CENTAUR_PROEJCT_IDS.includes(project._id))
              .sort((a, b) => a.edition_price - b.edition_price)
              .map((project) => (
                <ProjectBlockNoSSR key={project._id} {...project} showPrice />
              ))}
          </div>
        }
      />
      <GrantPoolHome />
      <InspirationFooter />
    </section>
  );
}
