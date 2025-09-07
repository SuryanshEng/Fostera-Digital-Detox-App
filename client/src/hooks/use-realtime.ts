import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      // Invalidate key queries every minute to simulate real-time updates
      queryClient.invalidateQueries({ queryKey: ['/api/screen-time/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/focus/active'] });
      setLastUpdate(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [queryClient]);

  return { lastUpdate };
}

export function useScreenTimeUpdates() {
  const [screenTime, setScreenTime] = useState(0);
  const [pickups, setPickups] = useState(0);

  useEffect(() => {
    // Simulate screen time incrementing
    const interval = setInterval(() => {
      setScreenTime(prev => prev + 1);
      
      // Randomly increment pickups
      if (Math.random() < 0.1) { // 10% chance every minute
        setPickups(prev => prev + 1);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return { screenTime, pickups };
}
