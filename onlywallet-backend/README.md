build/run container locally
--------------------------

```bash
docker build -t onlywallet-api:v1 .
docker run -it -p 3000:3000 onlywallet-api:v1
```

setup kubectl (local cluster)
------------------------

```bash
minikube start --vm-driver=xhyve
Starting local Kubernetes v1.10.0 cluster...
Starting VM...
WARNING: The xhyve driver is now deprecated and support for it will be removed in a future release.
Please consider switching to the hyperkit driver, which is intended to replace the xhyve driver.
See https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperkit-driver for more information.
To disable this message, run [minikube config set WantShowDriverDeprecationNotification false]
Downloading Minikube ISO
 150.53 MB / 150.53 MB [============================================] 100.00% 0s
Getting VM IP address...
Moving files into cluster...
Downloading kubeadm v1.10.0
Downloading kubelet v1.10.0
Finished Downloading kubelet v1.10.0
Finished Downloading kubeadm v1.10.0
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```

```bash
kubectl config use-context minikube
```

```bash
kubectl cluster-info
Kubernetes master is running at https://192.168.64.3:8443
KubeDNS is running at https://192.168.64.3:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

```
minikube dashboard
```

kubectl config
---------------

- resides in `~/.kube/config`
- can contain many config, choose one by `export KUBECONFIG=~/.kube/config-eks`

```bash
kubectl config view
apiVersion: v1
clusters:
- cluster:
    certificate-authority: /Users/prayagupd/.minikube/ca.crt
    server: https://192.168.64.3:8443
  name: minikube
contexts:
- context:
    cluster: minikube
    user: minikube
  name: minikube
current-context: minikube
kind: Config
preferences: {}
users:
- name: minikube
  user:
    client-certificate: /Users/prayagupd/.minikube/client.crt
    client-key: /Users/prayagupd/.minikube/client.key
```

kubectl deployment
---------------------

A Kubernetes Pod is a group of one or more Containers, tied together for the purposes of administration and networking. The Pod in this tutorial has only one Container.

```bash
docker build -t onlywallet-api:v1 .

eval $(minikube docker-env)
kubectl run onlywallet-pod --image=onlywallet-api:v1 --port=3000

# note: you can also pull from amazon elastic cloud registry(ecr)
# docker tag onlywallet-api:v1 <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/duwamish-repository
# aws ecr get-login --no-include-email --profile aws-work --region us-east-1
# docker login -u AWS -p <<password>>  https://<<account id>>.dkr.ecr.us-east-1.amazonaws.com
# docker push <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/duwamish-repository
# kubectl apply -f deployment.yaml

kubectl get deployments
kubectl get pods
kubectl get events
```

![](onlywallet_pods.png)

kubectl service
---------------

By default, the Pod is only accessible by its internal IP address within the Kubernetes cluster. 
To make the hello-node Container accessible from outside the Kubernetes virtual network, 
you have to expose the Pod as a Kubernetes Service.

```bash
kubectl expose deployment onlywallet-pod --type=LoadBalancer
kubectl get services
minikube service onlywallet-pod

## or kubectl apply -f config/service.yaml
## $ kubectl get services -o wide
NAME         TYPE           CLUSTER-IP       EXTERNAL-IP                                                               PORT(S)        AGE       SELECTOR
kubernetes   ClusterIP      172.zz.0.1       <none>                                                                    443/TCP        19h       <none>
onlywallet   LoadBalancer   172.zz.yyy.xxx   some_id1-some_id2.us-east-1.elb.amazonaws.com   80:30410/TCP   5m        app=onlywallet

# access EXTERNAL-IP/ which is a AWS LB

kubectl logs <POD-NAME=onlywallet-pod>
```

I can see the pods running once I SecureSHell the node,

```bash
[ec2-user@ip-10-0-0-110 ~]$ docker ps
CONTAINER ID        IMAGE                                                              COMMAND                  CREATED             STATUS              PORTS               NAMES
2a64894b19c9        <<account id>>.dkr.ecr.us-east-1.amazonaws.com/only-wallet         "node app.js"            27 minutes ago      Up 27 minutes                           k8s_onlywallet_onlywallet-8f7468988-dh8k4_default_54cc86c7-2db5-11e9-9298-0e8b7b1140de_0
```

![](onlywallet_kubectl_services.png)

references
-----------

https://kubernetes.io/docs/tutorials/hello-minikube/

