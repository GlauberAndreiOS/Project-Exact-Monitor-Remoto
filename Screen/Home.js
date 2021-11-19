import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';

import logo from '../assets/Image/Logo.png';
import {Ionicons} from '@expo/vector-icons';

import api from '../services/api.js';
import stylesHome from '../Styles/stylesHome';

export default function Home( {navigation} ) {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [hide, setHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function buscaLoginAsyncStorage(){
    var usuario = await AsyncStorage.getItem('@user');
    var senha = await AsyncStorage.getItem('@password');
    var endereco = await AsyncStorage.getItem('@url');
    if(usuario !== undefined && usuario !== null){
      setUser(usuario);
    }
    if(senha !==undefined && senha !== null){
      setPassword(senha);
    }
    if(endereco !== undefined && endereco !== null){
      setUrl(endereco);
    }
  }

  useEffect(() => {
    buscaLoginAsyncStorage();
  },[])

  let response;

  api.baseURL = 'http://'+url+':3000';
  async function getLogin(user, password) {
    AsyncStorage.setItem('@url', url);
    setIsLoading(!isLoading);
    response = await api.get(api.baseURL+'/login', {
      params: {
        "user": user,
        "password": password
      }
    }, {timeout: 10000})
    .then(function (response) {
      return response
    })
    .catch(function (error) {
      return error;
    });
    if(response.status == 204){
      Alert.alert("Usuário não encontrado");
      AsyncStorage.setItem('@signed', false);
      setIsLoading(false);
    }else if(response.status == 200){
      setIsLoading(false);
      AsyncStorage.setItem('@user', response.data[0].usuario);
      AsyncStorage.setItem('@password', response.data[0].senha);
      AsyncStorage.setItem('@signed', true);
      navigation.navigate("Routes");
    }else{
      Alert.alert("Erro ao tentar conectar a maquina servidora");
      setIsLoading(false);
    }
  }

  if(!isLoading){
    return (
      <KeyboardAvoidingView style = {stylesHome.container}>
        <View>
          <Image source={logo} style={stylesHome.imageLogo}/>
          <Text style={stylesHome.h2}>Gerenciador remoto dos{"\n"}Produtos Exact Sistemas</Text>
          <TextInput style = {stylesHome.input} placeholder="Usuário" autoCapitalize={'none'} 
          defaultValue={user} onChangeText={user => setUser(user)}/>
          <TextInput style = {stylesHome.input} placeholder="Senha" autoCorrect={false} secureTextEntry={hide}
          autoCapitalize={'none'} defaultValue={password} onChangeText={password => setPassword(password)}/>
          <TouchableOpacity style = {stylesHome.btnHide} onPress={()=>setHide(!hide)}>
            { hide ? <Ionicons name = "eye" color="black" size={20}/> : <Ionicons name = "eye-off" color="black" size={20}/> }
          </TouchableOpacity>
          <TextInput style = {stylesHome.input} placeholder="Endereço de IP" autoCapitalize={'none'}  keyboardType='numeric'
          defaultValue={url} onChangeText={url => setUrl(url)}/>
          <TouchableOpacity style = {stylesHome.btnEscSenha} onPress={()=>{Alert.alert("Entre em contato com Suporte")}}>
            <Text style= {stylesHome.textEsqSenha}>Esqueceu a senha?</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {stylesHome.btnEntrar} onPress={() => {
            if(!user){
              Alert.alert("Insira um usuário para entrar");
              if(!password){
                Alert.alert("Insira uma senha para entrar");
              }if(!url){
                Alert.alert("Insira o endereço de IP da maquina servidora");
              }
            }else{
              getLogin(user, password);
            }
          }}>
            <Text style= {stylesHome.textEntrar}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {stylesHome.btnNaoTemConta} onPress={()=>{Alert.alert("Entre em contato com Suporte")}}>
            <Text style= {stylesHome.textNaoTemConta}>Não tem conta?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }else{
    return(
      <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#00AFEF" />
      </View>
    );
  }
}