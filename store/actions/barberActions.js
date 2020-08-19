export const SET_BARBER= "SET_BARBER";




export const setBarber= id => {
    return async dispatch=>{
        try{

            const response= await fetch(`http://173.212.234.137:3000/barber/${id}`);

            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
            
            const barbersIDS = [];
            resData.forEach(e => {
                if(barbersIDS.indexOf(e.barberid)<0) {
                    barbersIDS.push(e.barberid);
                }
            });
              
            let allBarbers = [];
            
            barbersIDS.forEach( id => {
             
            let same = resData.filter(e=>e.barberid === id);
            
           
            let barber = {
                    id : same[0].barberid,
                    phone : same[0].phone,
                    password : same[0].password,
                    sex : same[0].sex,
                    name : same[0].barberName,
                    surname : same[0].surname,
                    b_name : same[0].b_name,
                    age:same[0].age,
                    email :same[0].email,
                    address : same[0].address,
                    image : same[0].image,
                    mark : same[0].mark,
                    wilaya : same[0].wilaya,
                    region : same[0].region,
                    lang : same[0].lang,
                    type : same[0].type,
                    services:[],
                    workingTimes:{}
                }
                const servicesIDS=[];
                same.forEach((e)=>{
                    
                    const workingTime={
                    
                        workingTimeID:e.workingTimeID,
                        day:e.day,
                        debut:e.debut,
                        finish:e.finish,
                        isworking:e.isworking,
                        theBarberID:e.barber_id
                    
                };
                    barber.workingTimes[e.day]=workingTime;
                    
                   
                    
                    if(e.id!==null && e.name!==null && e.price!==null && e.duration!==null && e.barber_id!==null && e.durationHours!==0 && e.durationMinutes!==0){
                       
                        const hours = (e.duration / 60);
                        const durationHours = Math.floor(hours);
                        const minutes = (hours - durationHours) * 60;
                        const durationMinutes = Math.round(minutes);
                       
                        const service = {
                            serviceId:e.id,
                            name : e.name,
                            price : e.price,
                            duration : e.duration,
                            barberID:e.barber_id,
                            durationHour:durationHours,
                            durationMinute:durationMinutes
                    }

                    

                    if(!servicesIDS.includes(e.id)){
                        barber.services.push(service);
                        servicesIDS.push(e.id);
                        console.log(servicesIDS);
                    }

                    
                    
                    
                    }else{
                        return;
                    }


                    
                    
                });
                allBarbers.push(barber);
                });
                
            dispatch({type:SET_BARBER,barberData:allBarbers});
      
       }catch(err){
           console.log(err);
       }

    };

};