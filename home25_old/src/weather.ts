export function getWeather(): void {
    let appid = import.meta.env.VITE_APPID;
    const apiKey = import.meta.env.VITE_APPID;
    console.log("Ma clé API :", apiKey);
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {

                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                const URL = 'http://localhost/weather?lat=' + latitude + '&lon=' + longitude
                    + '&appid=' + appid
                    + '&units=metric';

                fetch(URL)
                    .then(response => response.json())

            },
            (error) => {
                console.error("Erreur de géolocalisation :", error.message);
            }
        );
    } else {
        console.log("La géolocalisation n'est pas supportée par ce navigateur.");
    }
}