import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SellerDashboard from '../screens/seller/SellerDashboard';
import AddProductScreen from '../screens/seller/AddProductScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';
import ChatListScreen from '../screens/shared/ChatListScreen';
import ChatScreen from '../screens/buyer/ChatScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const DashStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

function DashStackScreen() {
  return (
    <DashStack.Navigator>
      <DashStack.Screen name="Dashboard" component={SellerDashboard} options={{ title: 'My Shop' }} />
      <DashStack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add Product' }} />
    </DashStack.Navigator>
  );
}

function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
      <ChatStack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
    </ChatStack.Navigator>
  );
}

export default function SellerNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.primary }}>
      <Tab.Screen name="Dashboard" component={DashStackScreen} />
      <Tab.Screen name="Orders" component={SellerOrdersScreen} />
      <Tab.Screen name="Messages" component={ChatStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
