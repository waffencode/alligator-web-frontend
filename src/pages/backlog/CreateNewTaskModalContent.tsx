import React, {useState} from 'react';
import styles from './CreateNewTaskModalContent.module.css'
import {format} from "date-fns";
import Button from "../../widgets/Button/Button";

const CreateNewTaskModalContent = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("E")
    const [deadline, setDeadline] = useState("");
    const [deadlineType, setDeadlineType] = useState("");

    return (
        <div className={styles.content}>
            Название:
            <input value={name} onChange={e => setName(e.target.value)}/>
            <br/>

            Описание:
            <textarea value={description} onChange={e => setDescription(e.target.value)}/>
            <br/>

            Приоритет:
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
            </select>
            <br/>

            Дедлайн:
            <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
            />
            <br/>

            Тип дедлайна:
            <select
                value={deadlineType}
                onChange={(e) => setDeadlineType(e.target.value)}
            >
                <option value="SOFT">МЯГКИЙ</option>
                <option value="HARD">ЖЕСТКИЙ</option>
            </select>

            <Button className={styles.create_button}>Создать</Button>
        </div>
    );
};

export default CreateNewTaskModalContent;