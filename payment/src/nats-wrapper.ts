import nats ,{Stan} from 'node-nats-streaming'

class NatsWrapper{

    private _client? : Stan;
    get client() {
        if(!this._client){
            throw new Error('Cannot access NATS client before connection');
        }

        return this._client;
    }


    connect(clusterId: string , clientId: string,url: string): Promise <void>{
        this._client = nats.connect(clusterId , clientId, {url,
            waitOnFirstConnect: true
        });


        return new Promise((resolve, reject)=>{
            this._client!.on('connect' , async () => {
                console.log('Connected to NATS');
                resolve();
            });
            this._client!.on('error', (err)=>{
                reject(err);
            })
        });
    }



}

export const natsWrapper = new NatsWrapper();
