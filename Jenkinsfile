node('master') {
    env.NAMESPACE = readFile('/var/run/secrets/kubernetes.io/serviceaccount/namespace').trim()
}

library identifier: 'hp-pipeline-library@master', retriever: modernSCM(
    [$class: 'GitSCMSource', remote: 'ssh://git@git.healthpartners.com/paas/hp-pipeline-library.git',
    credentialsId: "${env.NAMESPACE}-bitbucketsecret"]
)

def pipelineConfig = [
	appName: 'cypressautomation',
    team: 'QE',
  podName: "qe-cypress-pod-9"
]


pipelineWrap(pipelineConfig) { config ->
	environmentVars(config)

	node('master') {
     try {
      stage('Run Tests') {
        checkout scm
        sh "chmod +x ./execute.sh"
        sh "./execute.sh $config.podName"
      }
	}   catch (e) {
     	    sh "oc delete $config.podName"
     	}
    }
}