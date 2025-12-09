// Jenkinsfile for Funders Portal Docker deployment
// Uses the shared Jenkins library for standardized deployment

@Library('shared-jenkins-library') _

dockerPipeline(
    dockerImage: 'funders-portal',
    appPort: '3000',
    containerName: 'funders-portal',
    infisicalPath: '/funders-portal/',
    deploymentMethod: 'docker-compose',
    healthCheckWait: '30',
    cleanupOldImages: true,
    keepImageVersions: '3',
    project: 'afcen',
    healthCheckUrl: '/api/health'
)

