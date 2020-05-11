// Prevent update on unmounted component: basic
useEffect(() => {
    let isCancelled = false;
    const runAsync = async () => {
        try {
            if (!isCancelled) {
                // do the job
            }
        } catch (e) {
            if (!isCancelled) {
                throw e;
            }
        }
    };

    runAsync();

    return () => {
        isCancelled = true;
    };
}, [...]);

// Prevent update on unmounted component: setInterval/setTimeout

useEffect(() => {
    const interval = setInterval(() => {
        console.log('Five Seconds!');
    }, 5000);
    return () => clearInterval(interval);
}, []);

// Prevent update on unmounted component: Firestore Realtime Database
useEffect(() => {
    //Subscribe: firebase channel
    const cleanUp = firebase.firestore().collection('photos').doc(id)
        .onSnapshot(doc => {
            setLoading(false);
            setPhotos(doc)
        }, err => { setError(err); }
        );
    return () => cleanUp(); //Unsubscribe
}, []);

// Prevent update on unmounted component: fetch + AbortController
useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
        try {
            const ret = await fetch("/companies", { signal: abortController.signal });
            const data = await ret.json();
            // ...
        }
        catch (error) {
            if (abortController.signal.aborted) {
                // cancelled
            }
            else
                throw error;
        };
    };

    fetchData();

    return () => abortController.abort();
}, [companies]);

// Prevent update on unmounted component: axios
useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
        try {
            const response = await Axios.get("/companies", {
                cancelToken: source.token
            });
            // ...
        } catch (error) {
            if (Axios.isCancel(error)) {
                //cancelled
            } else {
                throw error;
            }
        }
    };

    fetchData()

    return () => {
        source.cancel();
    };
}, [companies]);