import { RecentSales } from '@/features/overview/components/recent-sales';
import { openCallService } from '@/server/services/open-call.service';

export default async function Sales() {
  const allCalls = await openCallService.findAll();
  const recentCalls = allCalls.slice(0, 5).map((call) => {
    // Convert Mongoose document to plain object
    const plainCall = JSON.parse(JSON.stringify(call));
    return {
      ...plainCall,
      id: plainCall._id || ''
    };
  });
  return <RecentSales recentCalls={recentCalls} />;
}
