import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addDoc, collection, firestore, MESSAGES, serverTimestamp, query, onSnapshot, deleteDoc, doc } from './firebase/Config';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';



export default function App() {
  const [messages, setMessages] = useState([])
  const [localMessages, setLocalMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
      const q = query(collection(firestore,MESSAGES))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tempMessages = []
        querySnapshot.forEach((doc) => {
          tempMessages.push({...doc.data(),id: doc.id})
        })
        setMessages(tempMessages)
      })
      getLocalData()

      return () => {
        unsubscribe()
      }
  }, [])

  const getLocalData = async () => {
    try{
        const value =  await AsyncStorage.getItem("Shoppinglist")
        let json = JSON.parse(value)
        if (json === null) {
          json = []
        }
        setLocalMessages(json)
    }catch(e){
      console.log(e)
    }
  }

  const saveLocally = async () => {    
    const newItem = {
        id: uuid.v4(),
        tuote : newMessage
    }
    const tempData = [...localMessages, newItem]
    setLocalMessages(tempData)

    try {
      const json = JSON.stringify(tempData)

      await AsyncStorage.setItem("Shoppinglist", json)
      console.log("Locally saved")
      setNewMessage('')

    } catch (e) {
      console.log(e)
    }
  }
  
  const save = async () => {
    const docRef = await addDoc(collection(firestore, MESSAGES),{
      text: newMessage,
      created: serverTimestamp()
    }).catch (error => console.log(error))
    setNewMessage('')
    console.log('Message saved')
  }

  const removeMessage = async (id) => {
    try {
      await deleteDoc(doc(firestore, MESSAGES, id));
      console.log('Message deleted');
    } catch (error) {
      console.log('Error deleting message:', error);
    }
  }

  const removeLocal = async (id) => {
    console.log("Delete Info")
    let newArray = [...localMessages] 
    
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].id === id) {
        newArray.splice(i, 1)
      }
    }

    setLocalMessages(newArray)

    try {
      const json = JSON.stringify(newArray)
      await AsyncStorage.setItem("Shoppinglist", json)
    }catch(e){
      console.log(e)
    }

  } 

  const Item = ({title, id}) => {    

    return (
      <View style={styles.item}>
        <Text>{title}</Text>
        <Button
          title='Remove'
          onPress={() => removeLocal(id)}
        />
      </View>)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontWeight: "bold"}}>Shopping list</Text>

      <View style={styles.form}>
        <TextInput
          placeholder='Send message...'
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
        />
        <Button 
          title='Save to firebase'
          onPress={save}
        />

        <View style={{marginTop: 5}} >
          <Button 
            title="Save locally" 
            onPress={saveLocally}
          />
        </View>

      </View>

      <Text style={{fontWeight: "bold"}}>Firebase data</Text>


      <ScrollView style={styles.scrollView}>
        {
          messages.map((message)=> (
            <View key={message.id} style={styles.message}>
              <Text>{message.text}</Text>
              <Button
                title='Remove'
                onPress={() => removeMessage(message.id)}
              />

            </View>
           
          ))
        }
      </ScrollView>

      <Text style={{fontWeight: "bold"}}>Local data</Text>
      
      <FlatList
        style={styles.flatList}
        data = {localMessages}
        renderItem={({item}) => <Item title={item.tuote} id={item.id}/>}
        keyExtractor={(item) => item.id}
        
        />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 8
  },form: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,

  },message: {
    margin: 16,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    marginBottom: 10,
  },
  scrollView:{
    maxHeight: 200,
  },
  item: {
    margin: 16,
    padding: 10,
    flexDirection: 'row',
    width:'90%',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  flatList: {
    width:'100%',
    maxHeight:200,
  }
});