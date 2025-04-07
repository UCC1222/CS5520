export default {
    expo: {
      name: "MyApp",
      slug: "my-app",
      version: "1.0.0",
      android: {
        package: "com.cc.myapp",
      },
      extra: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        eas: {
          projectId: "39aa660a-92ec-436c-8d32-bf8fd3e6dc8e",
        },
      },
    },
  };