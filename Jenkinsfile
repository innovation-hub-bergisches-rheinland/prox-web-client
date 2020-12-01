node {
    def revision
    def changelist

    def repository = 'docker.nexus.archi-lab.io/ihbr'
    def image
    def tag

    def server = 'tcp://10.10.10.42:2376'
    def certs = 'prox-dev-certs'
    def tagPrefix = 'dev'

    stage('Checkout') {
        checkout scm

        def packageJSON = readJSON file: 'package.json'

        revision = packageJSON.version
        changelist = tagPrefix + '-' + env.BUILD_NUMBER

        image = packageJSON.name
        tag = revision + changelist
    }

    stage('Build') {
        docker.withRegistry('https://docker.nexus.archi-lab.io', 'archilab-nexus-jenkins') {
            sh "docker build -t ${repository}/${image} -f docker/Dockerfile ."
            sh "docker tag ${repository}/${image} ${repository}/${image}:${tag}"
            sh "docker push ${repository}/${image}:${tag}"
        }
    }

    stage('Deploy') {
        docker.withServer(server, certs) {
            docker.withRegistry('https://docker.nexus.archi-lab.io', 'archilab-nexus-jenkins') {
                sh "env REPOSITORY=${repository} IMAGE=${image} TAG=${tag} \
                    docker stack deploy \
                    --with-registry-auth \
                    -c docker/docker-compose.yml \
                    -c docker/docker-compose.prod.yml \
                    ${image}"
            }
        }
    }
}
