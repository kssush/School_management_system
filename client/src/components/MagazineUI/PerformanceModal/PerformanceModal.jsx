import { useEffect, useState } from "react";
import useErrorHandler from "../../../hooks/useErrorHandler";
import { useAddPerformanceMutation, useUpdatePerformanceMutation } from "../../../store/api/magazineApi";
import Modal from "../../UI/Modal/Modal";
import Input from "../../UI/Input/Input";
import Select from "../../UI/Select/Select";
import st from "./PerformanceModal.module.scss";

const PerformanceModal = ({active, callback, id_magazine, id_student, id_performance, remark = false}) => {
    const [input, setInput] = useState({});
    console.log('324', remark)
    const { errors, handlerError, clearError, clearAllErrors } = useErrorHandler();

    const [addPerformance] = useAddPerformanceMutation();
    const [updatePerformance] = useUpdatePerformanceMutation();

    useEffect(() => {
        if(active){
            setInput({})
            clearAllErrors();
        }
    }, [active])

    const handleInput = (name, value) => {
        setInput(prev => ({
            ...prev,
            [name]: name != 'pass' ? value : value.name == 'Presence' ? false : true
        }))

        clearError(name);

        if(name == 'mark'){
            value = Number(value);

            if (!Number.isInteger(value) || value < 0 || value > 5) {
                handlerError(
                    new Error('Marks range from 0 to 5. Use 0 to remove the mark.'), 
                    name
                );
            }
        }
        
        if(name == 'remark'){
            const temp = value.trim();

            if(temp.length != '' && (temp.length < 6 || temp.length > 40)){
                handlerError(
                    new Error('The remark must contain more than 6 and less than 40 letters!'), 
                    name
                );
            }
        
            if(temp == ''){
                setInput(prev => ({
                    ...prev,
                    [name]: undefined
                }))
            }
        }
    }

    const handleCloseModal = () => callback(false);

    const handleAddPerformance = async () => {
        try{
            if(!id_magazine) {
                handlerError(new Error('To add a performance, select a lesson!'));
                return;
            }

            if(!id_student) {
                handlerError(new Error('To add a performance, select a student!'));
                return;
            }

            if(Object.values(input).length == 0) {
                handlerError(new Error('At least one field must be filled in!'));
                return;
            }
            
            if(input.mark){
                let value = Number(input.mark);

                if (!Number.isInteger(value) || value < 0 || value > 5) {
                    handlerError( new Error('Marks range from 0 to 5. Use 0 to remove the mark.'));
                    return;
                }
            }
            
            if(input.remark){
                let value = input.remark;
                
                if(value.length < 6 || value.length > 40){
                    handlerError(new Error('The remark must contain more than 6 and less than 40 letters!'));
                    return;
                }
            }

            if(input.pass == true) setInput(prev => ({pass: true}))

            await addPerformance({id_magazine, id_student, ...input});
            handleCloseModal();
        }catch(error){
            handlerError(error);
        }
    }

    const handleUpdatePerformance = async () => {
        try{
            if(!id_performance) {
                handlerError(new Error('To add a performance, select a performance!'));
                return;
            }

            if(Object.values(input).length == 0) {
                handlerError(new Error('At least one field must be filled in!'));
                return;
            }
            
            if(input.mark){
                let value = Number(input.mark);

                if (!Number.isInteger(value) || value < 0 || value > 5) {
                    handlerError(new Error('Marks range from 0 to 5. Use 0 to remove the mark.'));
                    return;
                }
            }

            if(input.remark){
                let value = input.remark;
               
                if(value.length < 6 || value.length > 40){
                    handlerError(new Error('The remark must contain more than 6 and less than 40 letters!'));
                    return;
                }
            }

            if(input.pass == true) setInput(prev => ({pass: true}))

            await updatePerformance({id: id_performance, ...input});
            handleCloseModal();
        }catch(error){
            handlerError(error);
        }
    }

    const handleRemoveRemark = async () => {
        await updatePerformance({id: id_performance, remark: null});
        handleCloseModal();
    }

    return(
        <Modal
            callback={callback}
            active={active}
            textHeader={!id_performance ? 'Add performance' : 'Update the perfomance'}
            textClose={'Close'}
            textConfirm={!id_performance ? 'Add' : 'Update'}
            onClose={handleCloseModal}
            onConfirm={!id_performance ? handleAddPerformance : handleUpdatePerformance}
        >   
            <Select placeholder={'Pass'} data={[{name: 'Absence'}, {name: 'Presence'}]} callback={handleInput}/>
            <Input placeholder={'Mark'} callback={handleInput} error={errors.mark} /> 
            <Input placeholder={'Remark'} callback={handleInput} error={errors.remark}/> 
            {remark && <button className={st.removeRemark} onClick={handleRemoveRemark}>Click to remove the remark</button>}
        </Modal>
    )
}

export default PerformanceModal;