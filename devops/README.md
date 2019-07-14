
- https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html
create [k8s control panel](https://kubernetes.io/docs/concepts/#kubernetes-control-plane) on vpc1, 
worker nodes on vpc2

- https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html

```bash
aws eks describe-cluster --name onlywallet-dev --profile aws-work --region us-east-1

kubectl cluster-info
Kubernetes master is running at https://<<ID>>.sk1.us-east-1.eks.amazonaws.com
CoreDNS is running at https://<<ID>>.sk1.us-east-1.eks.amazonaws.com/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

k8s Nodes
-----

- launch nodes(Physical/ VM) - https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html using template
at https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2019-01-09/amazon-eks-nodegroup.yaml

- node rhel ami - ami-011b3ccf1bd6db744, needs more than 30 Gi or else will get "Group did not stabilize".
Also use ami-0c24db5df6badc35a for base image https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html
which could be causing issues to register nodes to cluster.

```
## create nodes using cloudformation
ClusterControlPlaneSecurityGroup	sg-d35bb589	-
ClusterName	duwamish-dev-k8s	-
KeyName	duwamish-dev-key	-
NodeAutoScalingGroupDesiredCapacity	3	-
NodeAutoScalingGroupMaxSize	4	-
NodeAutoScalingGroupMinSize	2	-
NodeGroupName	duwamish-dev-k8s-nodes	-
NodeImageId	ami-011b3ccf1bd6db744	-
NodeInstanceType	t2.medium	-
NodeVolumeSize	20	-
Subnets	subnet-01a4f366,subnet-18104d36	-
VpcId	vpc-53533029	-
```

```bash
kubectl apply -f aws-auth-cm.yaml
```

- https://kubernetes.io/docs/concepts/architecture/nodes/

errors
- Desired capacity:3 must be between the specified min size:1 and max size:2 (Service: AmazonAutoScaling; Status Code: 400; Error Code: ValidationError; Request ID: 85edb00e-2d6e-11e9-bb71-5550760811eb)

- It will create a node (can be viewed in ec2 tabs) with nodes being to able to talk to each other, 
and k8s control plane.

```bash
$ kubectl get namespaces
NAME          STATUS    AGE
default       Active    7h
kube-public   Active    7h
kube-system   Active    7h

$ kubectl get storageclass
NAME            PROVISIONER             AGE
gp2 (default)   kubernetes.io/aws-ebs   12h

$ kubectl get configmaps -n kube-system
NAME                                 DATA      AGE
coredns                              1         11h
extension-apiserver-authentication   5         11h
kube-proxy                           1         11h

$ kubectl apply -f aws-auth-cm.yaml
configmap/aws-auth created

$ kubectl describe configmap -n kube-system aws-auth
Name:         aws-auth
Namespace:    kube-system
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"v1","data":{"mapRoles":"- rolearn: arn:aws:iam::account_id:role/role_name\n  use...

Data
====
mapRoles:
----
- rolearn: arn:aws:iam::account_id:role/role_name
  username: system:node:{{EC2PrivateDNSName}}
  groups:
    - system:bootstrappers
    - system:nodes

Events:  <none>
```

```bash
$ kubectl get nodes
NAME                         STATUS    ROLES     AGE       VERSION
ip-10-0-0-110.ec2.internal   Ready     <none>    1m        v1.11.5
```
