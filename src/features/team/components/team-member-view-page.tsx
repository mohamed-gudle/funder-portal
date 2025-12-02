import { teamMemberService } from '@/server/services/team-member.service';
import TeamMemberForm from './team-member-form';

type Props = {
  teamId: string;
};

export default async function TeamMemberViewPage({ teamId }: Props) {
  let teamMember = null;

  if (teamId !== 'new') {
    const rawMember = await teamMemberService.findById(teamId);
    if (!rawMember) {
      return <div>Team member not found</div>;
    }
    teamMember = JSON.parse(JSON.stringify(rawMember));
  }

  return (
    <TeamMemberForm
      initialData={teamMember || null}
      pageTitle={teamMember ? 'Edit Team Member' : 'Create Team Member'}
    />
  );
}
