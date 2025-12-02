import { fakeTeamMembers } from '@/constants/mock-modules';
import TeamMemberForm from './team-member-form';

type Props = {
  teamId: string;
};

export default async function TeamMemberViewPage({ teamId }: Props) {
  let teamMember = null;

  if (teamId !== 'new') {
    teamMember = await fakeTeamMembers.getById(teamId);
    if (!teamMember) {
      return <div>Team member not found</div>;
    }
  }

  return (
    <TeamMemberForm
      initialData={teamMember || null}
      pageTitle={teamMember ? 'Edit Team Member' : 'Create Team Member'}
    />
  );
}
