import React, {useContext, useEffect, useState} from 'react';
import Sidebar from '../../widgets/Sidebar';
import Slider from "react-slick";
import './AvaliableTeamsPage.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { Team } from '../../shared/api/IResponses';
import { useNavigate } from 'react-router-dom';
import ApiContext from "../../features/api-context";

const AvailableTeamsPage: React.FC = () => {
    const {api} = useContext(ApiContext);

    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
    const navigate = useNavigate(); 

    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.team.getTeamsOfCurrentUserWithMemberCount().
        then((teams) => {
            setTeams(teams);
        })
            .catch((err) => {
                console.error('Failed to fetch user teams', err);
                setError('Failed to load user teams');
            });
    }, []);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="avaliable-teams-page">
            <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
            <div className="teams-content">
                <h1>Доступные команды</h1>
                {error ? (<div className="error-message">{error}</div>) : ('')}
                <div className="teams-list">
                    {teams.map((team) => (
                        <div key={team.id} className="team-tile">
                            <div className="team-info">
                                <h2>{team.name}</h2>
                                <p>{team.memberCount} участников</p>
                            </div>
                            <button className="navigate-button" onClick={() => navigate('/teams/team-members/${team.id}')}>Перейти</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvailableTeamsPage;
