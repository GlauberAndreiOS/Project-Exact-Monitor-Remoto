import React, { useState, useEffect } from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import api from '../services/api';
import PureChart from 'react-native-pure-chart';
import stylesGraficos from '../Styles/stylesGraficos';

export default function Graficos( {navigate} ) {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [data, setData] = useState([]);
  const [sensor, setSensor] = useState([]);
  const [horas, setHoras] = useState(1);
  const [selectedSensor, setSelectedSensor] = useState();

  async function getLeituras(horas, sensor){
      setLoading(true)
      api.get(api.baseURL+'/graficos',{
          params:{
              "horas": horas,
              "sensor": sensor
          }
      })
      .then((result) => {
          setData(result.data)
      }).catch((err) => {
          setErro(true);
      }).finally(() => {
          setLoading(false)
      });
  }

  async function getSensores(){
      api.get(api.baseURL+'/sensores')
      .then((result) => {
          setSensor(result.data.map(a=>a.sensor))
      }).catch((err) => {
          setErro(true);
      }).finally(() => setLoading(false));
  }

  useEffect(()=>{
      getSensores()
  }, [])

  if(!erro){
    return(
      <View style={{ flex:1, flexDirection: 'row', backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 30 }}>
        <View style={{flex: 1, height: '100%'}}>
          <Picker
              style={{ height: 30, borderColor:'white', textAlign:'center'}}
              mode="dropdown"
              selectedValue={selectedSensor}
              onValueChange={(itemValue, itemIndex) => {
                  setSelectedSensor(itemValue);
                  getLeituras(horas, sensor[itemValue])
              }}>
                  <Picker.Item label={"Selecione um Sensor"} value={null}/>
              {sensor.map((item, index) => {
                  return (<Picker.Item label={item} value={index} key={index}/>) 
              })}
          </Picker>
          {loading ? <ActivityIndicator/> :(
            <>
              <Text style={stylesGraficos.nome}>{horas}h atrás</Text>
              <View style={{ flex:1, flexDirection: 'row', backgroundColor: 'white', paddingVertical: 50, alignItems: 'center', justifyContent: 'center'}}>
                  <PureChart
                    numberOfYAxisGuideLine={20}
                    width={'100%'}
                    height={400}
                    data={data}
                    type='line'
                    customValueRenderer={(index, point) => {
                        if (index % 2 == 0) return null
                        return (
                            <Text style={{textAlign: 'center'}}>{point.y}</Text>
                        )}
                      }
                  />
              </View>
              <View style={{flexDirection:'row-reverse'}}>
                  <TouchableOpacity style={stylesGraficos.btnHoras} onPress={(horas)=>{
                      setHoras(2);
                      getLeituras(2, sensor[selectedSensor]);
                  }}>
                      <Text style={stylesGraficos.textHoras}>2h</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={stylesGraficos.btnHoras} onPress={(horas)=>{
                      setHoras(4);
                      getLeituras(4, sensor[selectedSensor]);
                  }}>
                      <Text style={stylesGraficos.textHoras}>4h</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={stylesGraficos.btnHoras} onPress={(horas)=>{
                      setHoras(8);
                      getLeituras(8, sensor[selectedSensor]);
                  }}>
                      <Text style={stylesGraficos.textHoras}>8h</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={stylesGraficos.btnHoras} onPress={(horas)=>{
                      setHoras(12);
                      getLeituras(12, sensor[selectedSensor]);
                  }}>
                      <Text style={stylesGraficos.textHoras}>12h</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={stylesGraficos.btnHoras} onPress={(horas)=>{
                      setHoras(24);
                      getLeituras(24, sensor[selectedSensor]);
                  }}>
                      <Text style={stylesGraficos.textHoras}>24h</Text>
                  </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    );
  }else{
    return(
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center',  backgroundColor: 'white'}}>
          <Text style={stylesGraficos.erro}>
              Não foi possivel carregador os dados do banco de dados
          </Text>
      </View>
    );
  }
}