import React from 'react';
import st from './CreateSection.module.scss';
import ButtonCustom from '../UI/ButtonCustom/ButtonCustom';
import Input from '../UI/Input/Input';
import Select from '../UI/Select/Select';

const CreateSection = ({data, form, actions, dataSelect, update = 'Add'}) => {
    const { info, personal, work } = data;
    const { callback, errors } = form;
    const { handleAdd, handleClose } = actions;

    return(
        <>
            <div className={st.createSection}>
                <InputBox text={'Info'} data={info} callback={callback} errors={errors}/>
                <div className={st.otherContainer}>
                    <InputBox text={'Personal'} data={personal} callback={callback} errors={errors}/>
                    {dataSelect == undefined ? (
                            <InputBox text={'Work'} data={work} callback={callback} errors={errors}/>
                        ): (
                            <SelectBox text={'Work'} data={work} callback={callback} dataSelect={dataSelect}/>
                        )
                    } 
                </div>
            </div>
            <div className={st.buttons}>
                <ButtonCustom text={update} click={handleAdd} status={'confirm'}/>
                <ButtonCustom text={'Close'} click={handleClose} status={'close'}/>
            </div>
        </>
    )
}

export default CreateSection;


const InputBox = ({text, data, callback, errors}) => {
    if(!data) return null;

    return(
        <div className={st.sectionBox}>
            <p>{text}</p>
            <div className={st.container}>
                {data?.map(el => (
                    <Input key={el} placeholder={el} callback={callback} error={errors[el.toLowerCase()]}/>
                ))}
            </div>
        </div>
    )
}

const SelectBox = ({text, data, dataSelect, callback}) => {
    return(
        <div className={st.sectionBox}>
            <p>{text}</p>
            <div className={st.container}>
                {data?.map(el => (
                    <Select key={el} placeholder={el} data={dataSelect} callback={callback}/>                
                ))}
            </div>
        </div>
    )
}

