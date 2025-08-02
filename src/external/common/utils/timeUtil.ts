export function tic(): number {
  return (new Date()).getTime();
}

export function toc(msec: number): number {
  return (new Date()).getTime() - msec;
}

export async function sleep(msec: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('sleep:', msec);
      resolve();
    }, msec);
  });
} 