
interface ProcessOptionsArray {
    [index: number]: { processName: string; processTitle: string; processId: number };
}

declare module 'get-window-by-name' {
    function getWindowText(name: string): ProcessOptionsArray?; 
}