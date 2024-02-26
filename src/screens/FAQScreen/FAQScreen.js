import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {BackHandler, FlatList, Text, View} from 'react-native';
import preStyles from './styles';

function FAQScreen(props) {
  const styles = preStyles(props.screenProps.theme);

  const sections = [
    {
      key: '1',
      section: 'Shop',
      questions: [],
    },
    {
      key: '2',
      section: 'Payment Methods',
      questions: [
        {
          question: 'What payment methods are available?',
          answer:
            'We accept the following forms of payment:\n\n  1. Credit Card\n  2. Debit Card\n',
        },
      ],
    },
    {
      key: '3',
      section: 'Shipping',
      questions: [],
    },
    {
      key: '4',
      section: 'Customer Support',
      questions: [],
    },
    {
      key: '5',
      section: 'Return/Exchange Policy',
      questions: [],
    },
  ];
  useEffect(() => {
    const handler = () => {
      props.navigation.goBack();
      return true;
    };

    // Back handler
    BackHandler.addEventListener('hardwareBackPress', handler);
    return () => BackHandler.removeEventListener('hardwareBackPress', handler);
  }, []);

  const renderQuestion = question => {
    return (
      <View key={question.question} style={styles.questionContainer}>
        <Text style={styles.question}>{question.question}</Text>
        <Text style={styles.answer}>{question.answer}</Text>
      </View>
    );
  };
  const renderSection = ({item}) => {
    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{item.section}</Text>
        </View>
        {item.questions.map(q => renderQuestion(q))}
      </>
    );
  };
  const renderDivider = () => (
    <View
      style={{
        height: 1,
        width: '92%',
        marginVertical: 12,
        backgroundColor: '#CED0CE',
        marginLeft: '4%',
        marginRight: '4%',
      }}
    />
  );

  return (
    <SafeAreaView>
      <FlatList
        style={styles.container}
        ItemSeparatorComponent={renderDivider}
        renderItem={renderSection}
        data={sections}
        ListFooterComponent={<View style={{height: 24}} />}
      />
    </SafeAreaView>
  );
}

export default FAQScreen;
