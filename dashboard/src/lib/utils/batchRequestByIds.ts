export type BatchResult = {
    success: number;
    failed: number;
    details: { id: string; status?: number; error?: string }[];
  };

  export default async function batchRequestByIds (ids: readonly string[], requestFunction : (id : string) => Promise<Response>) : Promise<BatchResult> {
    const results = await Promise.allSettled(ids.map (id => requestFunction(id))) ;



    const resultsSummary: BatchResult = {
        success: 0,
        failed: 0,
        details: [],
      };


      results.forEach((res, index) => {
        const id = ids[index];
        if (res.status === 'fulfilled') {
          const response = res.value;
          if (response.ok) {
            resultsSummary.success++;
            resultsSummary.details.push({ id, status: res.value.status });
          } else {
            resultsSummary.failed++;
            resultsSummary.details.push({
              id,
              status: response.status,
              error: `HTTP ${response.status}: ${response.statusText}`,
            });
          }
            
        } else {
            resultsSummary.failed++;
            resultsSummary.details.push({ id, error: res.reason?.message || 'Unknown error' });
        }
      });

    return resultsSummary;



  } 