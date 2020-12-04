import React, {useState, useEffect} from 'react';
import './App.css';
import MapService from './components/MapDrawService.js';
// import DropDownPicker from 'react-native-dropdown-picker';
// import logo from './image/car.jpg';
import {DropdownButton, Dropdown} from 'react-bootstrap';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

function App() {
  const options = [
    {
      value: 'nissan',
      label: 'nissan',
    },
    {
      value: 'civic',
      label: 'civic',
    },
  ];

  const listCars = () => {
    const result = [];
    for (let index = 0; index < options.length; index++) {
      result.push(
        <Dropdown.Item key={'listCars' + index} as="button" eventKey={index}>
          {options[index].label}
        </Dropdown.Item>,
      );
    }
    return result;
  };

  const [carPosition, setCarPosition] = useState(options[0].value);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              {/* <Text style={styles.sectionTitle}>NDTH MAP</Text> */}
              <DropdownButton
                id="dropdown-item-button"
                title={carPosition}
                onSelect={(e) => {
                  setCarPosition(options[e].value);
                }}>
                {listCars()}
              </DropdownButton>
              <MapService car={carPosition} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 0,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
