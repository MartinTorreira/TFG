import {
    fetchConfig,
    appFetch,
    setServiceToken,
    getServiceToken,
    removeServiceToken,
    setReauthenticationCallback,
  } from "./appFetch";
  
  const processLoginSignUp = (authenticatedUser, reauthenticationCallback, onSuccess) => {
    console.log("ProcessLoginSignUp");
    setServiceToken(authenticatedUser.serviceToken);
    setReauthenticationCallback(reauthenticationCallback);
    onSuccess(authenticatedUser);
  }
  
  export const login = (
    userName,
    password,
    onSuccess,
    onErrors,
    reauthenticationCallback
  ) => {
    appFetch(
      "/user/login",
      fetchConfig("POST", { userName, password }),
      (authenticatedUser) => {
        processLoginSignUp(authenticatedUser, reauthenticationCallback, onSuccess);
      },
      onErrors
    );
  }
  
  export const signUp = (user, onSuccess, onErrors, reauthenticationCallback) => {
    appFetch(
      "/user/signUp",
      fetchConfig("POST", user),
      (authenticatedUser) => {
        processLoginSignUp(authenticatedUser, reauthenticationCallback, onSuccess);
      },
      onErrors
    );
  };
  
  
  export const tryLoginFromServiceToken = (
    onSuccess,
    reauthenticationCallback
  ) => {
    const serviceToken = getServiceToken();
  
    if (!serviceToken) {
      onSuccess();
      return;
    }
  
    setReauthenticationCallback(reauthenticationCallback);
  
    appFetch(
      "/users/loginFromServiceToken",
      fetchConfig("POST"),
      (authenticatedUser) => onSuccess(authenticatedUser),
      () => removeServiceToken()
    );
  };
  
  
  
  export const logout = () => removeServiceToken();
  
  export const updateProfile = ( user, onSuccess, onErrors) =>
    appFetch(`/user/${user.id}/updateProfile`, fetchConfig("PUT", user), onSuccess, onErrors);
  
  export const changePassword = (
    id,
    oldPassword,
    newPassword,
    onSuccess,
    onErrors
  ) =>
    appFetch(
      `/user/${id}/changePassword`,
      fetchConfig("POST", { oldPassword, newPassword }),
      onSuccess,
      onErrors
    );
  
  
  export const changeAvatar = (
    userId,
    url,
    onSuccess,
    onErrors
  ) => {
    appFetch(
      `/users/${userId}/changeAvatar`,
      fetchConfig("POST", { url }),
      onSuccess,
      onErrors
    );
  }
 