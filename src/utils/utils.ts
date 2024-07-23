export function debounce(func: any, timeout = 300){
    let timer: NodeJS.Timeout ;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func(args); }, timeout);
    };
  }