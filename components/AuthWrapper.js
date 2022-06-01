import React from 'react';
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useAuth } from '../context/auth';

const AuthWrapper = ({ children }) => {
    const { isLoading } = useAuth();
    if (isLoading) return null
    return children;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
});
export default AuthWrapper;