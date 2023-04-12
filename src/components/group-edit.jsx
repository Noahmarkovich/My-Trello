import { useEffect, useState } from "react"
import x from '../assets/img/x.svg'
import { boardService } from "../services/board.service"
import { addGroup } from "../store/board.actions"

export function GroupEdit({setIsNewGroupOpen, boardId, group, setGroupId}){

    const [newGroup, setNewGroup] = useState(boardService.getEmptyGroup())

    useEffect(() => {
        if (!group) return
        setNewGroup(group)
    }, [])

    async function onAddGroup(ev){
        ev.preventDefault()
        try{
            const savedGroup = await addGroup(newGroup, boardId)
            setNewGroup(boardService.getEmptyGroup())
            // setIsNewGroupOpen(false)
        }catch (err) {
        console.log(err)
    }  
    }
    async function onEditGroup(ev){
        ev.preventDefault()
        try{
            const savedGroup = await addGroup(newGroup, boardId)
            setGroupId(null)
            // setNewGroup(boardService.getEmptyGroup())
            // setIsNewGroupOpen(false)
        }catch (err) {
        console.log(err)
    }  
    }

    function handleChange({target}){
        const { value, name: field } = target
        setNewGroup((prevGroup) => ({ ...prevGroup, [field]: value }))
        
    }

    function closeForm(){
        setIsNewGroupOpen(false)
        setNewGroup(boardService.getEmptyGroup())
    }

    
    return <div className='group-preview'>
    <form onSubmit={(ev) =>  {group? onEditGroup(ev) : onAddGroup(ev)}}>
        <input
            type="text"
            name="title"
            value={newGroup.title}
            placeholder="Enter list title..."
            onChange={handleChange}
            required
            autoFocus
        />
        { !group && <div className='buttons-container'>
            <button>Add list</button>
            <img onClick={closeForm} className="icon delete" src={x} />
        </div>}
    </form>
</div>
}