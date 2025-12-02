import TeamMemberViewPage from '@/features/team/components/team-member-view-page';

export default function Page({ params }: { params: { teamId: string } }) {
  return <TeamMemberViewPage teamId={params.teamId} />;
}
