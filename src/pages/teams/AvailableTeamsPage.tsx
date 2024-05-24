import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import Slider from "react-slick";
import './AvaliableTeamsPage.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { getTeamsByUserIdWithCountOfMembers } from '../../shared/api';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { Team } from '../../shared/api/IResponses';

const AvaliableTeamsPage: React.FC = () => {
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню

    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getTeamsByUserIdWithCountOfMembers(token).
            then((teams) => {
                setTeams(teams);
            })
            .catch((err) => {
                console.error('Failed to fetch user profile', err);
                setError('Failed to load user profile');
            });
        } else {
            setError('No authentication token found');
        }
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
        <div className="profile-page">
            <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
            <div className="profile-content">
                <h1>Доступные команды</h1>
                {error ? (<div className="error-message">{error}</div>) : (
                    <Slider {...settings}>
                        {teams.map((team) => (
                            <div key={team.id} className="team-tile">
                                <h3>{team.name}</h3>
                                <p>Members: {team.memberCount}</p>
                            </div>
                        ))}
                    </Slider>
                )}
            </div>
        </div>
    );
};

export default AvaliableTeamsPage;
