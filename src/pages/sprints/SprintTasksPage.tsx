import React, { useContext, useEffect, useState } from 'react';
import './SprintTasksPage.css';
import { Sprint, Team, UserInfo_TeamMember } from '../../shared/api/IResponses';
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from '../../widgets/Layout/Layout';
import Content from '../../widgets/Content/Content';
import BrandLogo from '../../widgets/BrandLogo/BrandLogo';
import PageName from '../../widgets/PageName/PageName';
import Sidebar from '../../widgets/SideBar/SideBar';
import Button from "../../widgets/Button/Button";
import SprintsPage from "./SprintsPage";
import {useParams} from "react-router-dom";

const SprintTasksPage: React.FC = () => {
    const {api} = useContext(ApiContext);
    const sprintId = Number(useParams<{ id: string }>().id);

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Список задач в спринте" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.sprints} />}
            bottomRight={
                <Content>
                    {/*{error && <div className="error-message">{error}</div>}*/}
                    {/*<div className="profile-info">*/}
                    {/*    <div className="sprints-grid">*/}
                    {/*        <div className="sprints-grid-header">*/}
                    {/*            <div>Редактировать</div>*/}
                    {/*            <div>Название</div>*/}
                    {/*            <div>Команда</div>*/}
                    {/*            <div>Scrum-мастер</div>*/}
                    {/*            <div>Начало</div>*/}
                    {/*            <div>Конец</div>*/}
                    {/*            <div>SP</div>*/}
                    {/*            <div>Статус</div>*/}
                    {/*            <div>Задачи</div>*/}
                    {/*        </div>*/}
                    {/*        {sprints.map((sprint, index) => (*/}
                    {/*            <div key={index} className="sprint-tile">*/}
                    {/*                <div className="edit_button_container">*/}
                    {/*                    <button*/}
                    {/*                        className="edit_button"*/}
                    {/*                        onClick={() => handleEditClick(sprint)}*/}
                    {/*                    >*/}
                    {/*                        {editingSprintId === sprint.id ? '✓' : '✎'}*/}
                    {/*                    </button>*/}
                    {/*                </div>*/}
                    {/*                {editingSprintId === sprint.id ? (*/}
                    {/*                    <>*/}
                    {/*                        <input*/}
                    {/*                            type="text"*/}
                    {/*                            value={editedSprint?.name || ''}*/}
                    {/*                            onChange={(e) => handleSprintChange('name', e.target.value)}*/}
                    {/*                        />*/}
                    {/*                        <div>{sprint.team_name}</div>*/}
                    {/*                        <select*/}
                    {/*                            value={editedSprint?.scrumMaster_id || 0}*/}
                    {/*                            onChange={(e) => handleSprintChange('scrumMaster_id', parseInt(e.target.value))}*/}
                    {/*                        >*/}
                    {/*                            <option value="">Выберите Scrum-мастера</option>*/}
                    {/*                            {teamMembers.map((member) => (*/}
                    {/*                                <option key={member.id} value={member.id}>*/}
                    {/*                                    {member. fullName}*/}
                    {/*                                </option>*/}
                    {/*                            ))}*/}
                    {/*                        </select>*/}
                    {/*                        <input*/}
                    {/*                            type="date"*/}
                    {/*                            value={editedSprint ? format(new Date(editedSprint.startTime), 'yyyy-MM-dd') : ''}*/}
                    {/*                            onChange={(e) => handleSprintChange('startTime', e.target.value)}*/}
                    {/*                        />*/}
                    {/*                        <input*/}
                    {/*                            type="date"*/}
                    {/*                            value={editedSprint ? format(new Date(editedSprint.endTime), 'yyyy-MM-dd') : ''}*/}
                    {/*                            onChange={(e) => handleSprintChange('endTime', e.target.value)}*/}
                    {/*                        />*/}
                    {/*                        <input*/}
                    {/*                            type="number"*/}
                    {/*                            value={editedSprint?.sp || 0}*/}
                    {/*                            onChange={(e) => handleSprintChange('sp', e.target.value)}*/}
                    {/*                        />*/}
                    {/*                        <select*/}
                    {/*                            value={editedSprint?.state || ''}*/}
                    {/*                            onChange={(e) => handleSprintChange('state', e.target.value)}*/}
                    {/*                        >*/}
                    {/*                            <option value="PLANNING">PLANNING</option>*/}
                    {/*                            <option value="ACTIVE">ACTIVE</option>*/}
                    {/*                            <option value="STOPPED">STOPPED</option>*/}
                    {/*                            <option value="ENDED">ENDED</option>*/}
                    {/*                        </select>*/}
                    {/*                        <div></div>*/}
                    {/*                    </>*/}
                    {/*                ) : (*/}
                    {/*                    <>*/}
                    {/*                        <div>{sprint.name}</div>*/}
                    {/*                        <div>{sprint.team_name}</div>*/}
                    {/*                        <div>{sprint.scrumMaster_fullName}</div>*/}
                    {/*                        <div>{format(new Date(sprint.startTime), 'dd.MM.yyyy')}</div>*/}
                    {/*                        <div>{format(new Date(sprint.endTime), 'dd.MM.yyyy')}</div>*/}
                    {/*                        <div>{sprint.sp}</div>*/}
                    {/*                        <div>{sprint.state}</div>*/}
                    {/*                        <div><button>Перейти</button></div>*/}
                    {/*                    </>*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*        {isAddingNewSprint && (*/}
                    {/*            <div className="sprint-tile">*/}
                    {/*                <div className="edit_button_container">*/}
                    {/*                    <button*/}
                    {/*                        className="edit_button"*/}
                    {/*                        onClick={handleSaveNewSprint}*/}
                    {/*                    >*/}
                    {/*                        ✓*/}
                    {/*                    </button>*/}
                    {/*                </div>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    value={newSprint.name}*/}
                    {/*                    onChange={(e) => handleNewSprintChange('name', e.target.value)}*/}
                    {/*                />*/}
                    {/*                <select*/}
                    {/*                    value={newSprint.team_id}*/}
                    {/*                    onChange={(e) => handleNewSprintChange('team_id', parseInt(e.target.value))}*/}
                    {/*                >*/}
                    {/*                    <option value="">Выберите команду</option>*/}
                    {/*                    {teams.map((team) => (*/}
                    {/*                        <option key={team.id} value={team.id}>*/}
                    {/*                            {team.name}*/}
                    {/*                        </option>*/}
                    {/*                    ))}*/}
                    {/*                </select>*/}
                    {/*                <select*/}
                    {/*                    value={newSprint.scrumMaster_id}*/}
                    {/*                    onChange={(e) => handleNewSprintChange('scrumMaster_id', parseInt(e.target.value))}*/}
                    {/*                >*/}
                    {/*                    <option value="">Выберите Scrum-мастера</option>*/}
                    {/*                    {teamMembers.map((member) => (*/}
                    {/*                        <option key={member.id} value={member.id}>*/}
                    {/*                            {member.fullName}*/}
                    {/*                        </option>*/}
                    {/*                    ))}*/}
                    {/*                </select>*/}
                    {/*                <input*/}
                    {/*                    type="date"*/}
                    {/*                    value={newSprint.startTime}*/}
                    {/*                    onChange={(e) => handleNewSprintChange('startTime', e.target.value)}*/}
                    {/*                />*/}
                    {/*                <input*/}
                    {/*                    type="date"*/}
                    {/*                    value={newSprint.endTime}*/}
                    {/*                    onChange={(e) => handleNewSprintChange('endTime', e.target.value)}*/}
                    {/*                />*/}
                    {/*                <input*/}
                    {/*                    type="number"*/}
                    {/*                    value={newSprint.sp}*/}
                    {/*                    onChange={(e) => handleNewSprintChange('sp', e.target.value)}*/}
                    {/*                />*/}
                    {/*                <select*/}
                    {/*                    value={newSprint.state}*/}
                    {/*                    onChange={(e) => handleNewSprintChange('state', e.target.value)}*/}
                    {/*                >*/}
                    {/*                    <option value="PLANNING">PLANNING</option>*/}
                    {/*                    <option value="ACTIVE">ACTIVE</option>*/}
                    {/*                    <option value="STOPPED">STOPPED</option>*/}
                    {/*                    <option value="ENDED">ENDED</option>*/}
                    {/*                </select>*/}
                    {/*                <div></div>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*        <Button className="smallButton button" onClick={handleAddNewSprint}>Добавить спринт</Button>*/}

                    {/*    </div>*/}
                    {/*</div>*/}
                </Content>
            }
        />
    );
}

export default SprintTasksPage;