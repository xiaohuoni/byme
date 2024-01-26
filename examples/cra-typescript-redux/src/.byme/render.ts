import { createRoot } from 'react-dom/client'

export const render = (Root)=>{
    const container = document.getElementById('root') as HTMLDivElement
    const root = createRoot(container!)
    root.render(Root)
}
