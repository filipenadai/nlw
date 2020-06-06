import React, {useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import './stles.css';
import axios from 'axios';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

interface Items {
    id: number;
    title: string;
    image_url: string;
}

interface UFIBGEResponse {
    sigla: string;
}

interface CityIBGEResponse {
    nome: string;
}

const CreatePoint = () => {

    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [items, setItems] = useState<Items[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    useEffect(()=> {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(()=>{
        axios.get<UFIBGEResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
        const ufInitials = response.data.map(uf => uf.sigla);

        setUfs(ufInitials);
        });
    }, []);

    useEffect(()=>{
        if(selectedUF === '0'){
            return;
        }

        axios
        .get<CityIBGEResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        .then(response =>{
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        });

    }, [selectedUF]);

    function HandleSelectedUF(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setSelectedUF(uf);
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name" 
                            id="name"/>
                    </div>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email" 
                                id="email"/>
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp" 
                                id="whatsapp"/>
                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                        <Map center={[-22.3909612, -47.5570119]} zoom={15}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={[-22.3909612, -47.5570119]}/>
                        </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">UF</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUF} 
                                onChange={HandleSelectedUF}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                 <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                            
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                 <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url}alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>

        </div>
    );
}

export default CreatePoint;