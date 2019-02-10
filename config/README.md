
- https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html
- https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html

```bash
$ kubectl get namespaces
NAME          STATUS    AGE
default       Active    7h
kube-public   Active    7h
kube-system   Active    7h

kubectl apply -f aws-auth-cm.yaml
```
