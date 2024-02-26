import React, { useState } from 'react';
import { Switch, Text, ScrollView, View } from 'react-native';
import Button from 'react-native-button';
import Modal from 'react-native-modal';
import {
  ButtonGroup,
  Icon,
} from 'react-native-elements';
import DynamicAppStyles from '../../DynamicAppStyles';
import Chip from '../../components/Chip';
import Slider from 'react-native-sliders';

import preStyles from './styles';
let styles;

function SearchModal(props) {
  const COLOR_SCHEME = props.screenProps.theme;
  styles = preStyles(COLOR_SCHEME);

  const sorts = ['None', 'A-Z', 'Z-A', '₱ - ₱₱₱', '₱₱₱ - ₱'];
  const priceRanges = [
    "0 - 100",
    "100 - 500",
    "500 - 1000",
    "1000 - 5000",
  ];
  const tagsFromProps = props.categories;
  const [ selectedSort, setSelectedSort ] = useState(sorts.indexOf(props.sort));
  const [ priceRange, setPriceRange ] = useState(props.filters.price)
  const [ categories, setCategories ] = useState([]);

  const onClickApply = () => {
    props.updateFilters([
      ['price', priceRange],
      ['categories', categories]
    ]);
    props.updateSort(sorts[selectedSort]);
    props.onClose();
  }

  const onClickReset = () => {
    console.log('Reset Filters', props.filters);

    // Update own copy of state
    setPriceRange([
      props.filters.minPrice,
      props.filters.maxPrice,
    ]);
    setCategories([]);
    setSelectedSort(0);

    // Update parent state
    props.resetFilters();
    // Also resets sort ^
  }

  const renderSorts = () => {
    return (
      <>
      <Text style={styles.searchHints}>Sort by:</Text>
      <ButtonGroup
        selectedIndex={selectedSort}
        onPress={(idx) => {
          setSelectedSort(idx);
        }}
        buttonContainerStyle={styles.buttonGroupContainer}
        selectedButtonStyle={styles.selectedButtonGroupContainer}
        textStyle={styles.buttonGroupText}
        selectedTextStyle={styles.selectedButtonGroupText}
        buttons={sorts}
      />
      </>
    )
  }
  const renderPriceFilter = () => {
    return (
      <>
      <Text style={styles.searchHints}>Price</Text>
      <View style={styles.searchPriceView}>
        <Text style={[styles.searchHints, styles.dockLeft]}>₱{priceRange[0]}</Text>
        <Text style={[styles.searchHints, styles.dockRight]}>₱{priceRange[1]}</Text>
      </View>
      <Slider
        value={priceRange}
        step={1}
        onValueChange={newValues => {
          setPriceRange(newValues);
          // props.updateFilters('price', newValues);
        }}
        thumbTouchSize={{ width: 40, height: 40 }}
        minimumValue={props.filters.minPrice}   // Minimum value
        maximumValue={props.filters.maxPrice}   // Maximum value
        thumbTintColor={DynamicAppStyles.colorSet.mainThemeForegroundColor}
      />
      </>
    )
  }
  const renderCategoryFilter = () => {
    console.log('Categories', categories);
    if (tagsFromProps.length === 0) {
      return <>
        <Text style={styles.searchHints}>Categories</Text>
        <Text style={styles.searchHints}>No categories to filter.</Text>
      </>
    }
    return (
      <>
      <Text style={styles.searchHints}>Categories</Text>
      <View style={styles.searchTagsContainer}>
        {tagsFromProps.map((tag, i) => (
          <Chip key={tag}
            title={tag}
            theme={COLOR_SCHEME}
            type={categories.indexOf(i) > -1 ? "solid" : "outline"}
            onPress={() => {
              // Add to/remove from selected, and change its outline/solid type.
              const idx = categories.indexOf(i);
              const copy = [ ...categories ];
              if (idx > -1) {
                copy.splice(idx, 1);
              } else {
                copy.push(i);
              }
              setCategories(copy);

              // props.updateFilters('categories', copy)
            }}
          />
        ))}
      </View>
      </>
    )
  }
  const renderInStockOnly = () => {
    return (
      <View style={styles.searchPriceView}>
        <Text style={[styles.searchHints, styles.dockLeft]}>Show in stock only:</Text>
        <Switch
          value={props.filters.inStock}
          onValueChange={newValue => {
            props.updateFilters([
              ['inStock', newValue]
            ])
          }}
        />
      </View>
    )
  }
  return (
    <Modal
      style={[
        styles.modalContainer,
        {
          // marginBottom: 0,
          // marginTop: '30%',
          paddingTop: '10%',
        }
      ]}
      onBackButtonPress={props.onClose}
      onBackdropPress={props.onClose}
      propagateSwipe={true}
      isVisible={props.isVisible}>
        <View style={styles.modalView}>
          <View style={[
            styles.searchPriceView,
            {
              marginBottom: 16,
            }
          ]}>
            <Text style={[styles.filterHeader, styles.dockLeft]}>Filters</Text>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
              <Button
                onPress={onClickReset}
                >Clear&nbsp;&nbsp;</Button>
              <Button
                onPress={onClickApply}
              >Apply </Button>
            </View>
          </View>
          <ScrollView>
            {renderSorts()}
            {renderPriceFilter()}
            {renderCategoryFilter()}
            {renderInStockOnly()}
          </ScrollView>
        </View>
    </Modal>
  )
}

export default SearchModal;
