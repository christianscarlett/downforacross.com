import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import Scope from '../../lib/Puzzle/Scopes';

interface ScopeModalOptionProps {
  title: string;
  border: boolean;
  onPress: () => void;
}

function ScopeModalOption(props: ScopeModalOptionProps) {
  const {title, border, onPress} = props;
  const [theme] = useTheme();
  const styles = makeStyles(theme, border);
  return (
    <View style={styles.option}>
      <TouchableOpacity style={styles.optionTouchable} onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

interface ScopeModalProps {
  visible: boolean;
  setVisible: (_: boolean) => void;
  onSelectScope: (scope: Scope) => void;
}

function ScopeModal(props: ScopeModalProps) {
  const {visible, setVisible, onSelectScope} = props;
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  const scopes = Object.entries(Scope);
  const scopeOptions = scopes.map(([_, scope], i) => (
    <ScopeModalOption
      key={scope}
      title={scope}
      border={i !== scopes.length - 1}
      onPress={() => {
        onSelectScope(scope);
      }}
    />
  ));
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <Pressable style={styles.centeredView} onPress={() => setVisible(false)}>
        <View>
          <View style={styles.modalView}>{scopeOptions}</View>
        </View>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (theme: Theme, optionBorder: boolean = true) => {
  return StyleSheet.create({
    optionTouchable: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 30,
      paddingVertical: 20,
    },
    option: {
      width: '100%',
      borderBottomWidth: optionBorder ? 1 : 0,
      borderBottomColor: theme.colors.border,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalView: {
      margin: 20,
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
};
export default ScopeModal;
