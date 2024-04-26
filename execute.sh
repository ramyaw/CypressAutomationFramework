npm_commands=""

oc delete pod "$1"

#Check to see whether we have a parameter identifies the spec we want to run.  If we have one, then execute
#only the test specified.  Otherwise, execute all of the tests.
#npm run test -- --spec **/$2 || echo '** Non zero exit code probably due to failed test' && npm run create:html:report"
#This || tells the scrpt to capture an exit code from cypress if it exists and handle it - display a message 
#rather than throwing an exit code and killing the pod.  If we don't do this, we will never get to the npm command
#that creates the report.
if [[ $# > 1 ]]; then
  npm_commands="npm install && npm run test -- --spec **/$2 || echo '** Non zero exit code probably due to failed test'"
else
  npm_commands="npm install && npm run test || echo '** Non zero exit code probably due to failed test' "
fi

echo "commands to execute: $npm_commands"

#Execute the tar and piped oc run command in parallel with code searching for the TestRport directory
#on the pod. When the report has been created via the piped code, we can copy the test report
#down to the local directory before the pod goes away.
#Make sure to use the --image-pull=policy=Always or you may not be getting the changes you think you are.
#
#The & character at the end of the tar command tells the command to run in parallel. While the command is running,
#We can move on to other commands in the script.  This is important, because as soon as the piped tar command ends,
#the OpenShift pod will complete and go away.  To keep it around for a little bit, we add a sleep command at the end.
#Meanwhile, the code below is running in a loop, waiting for the TestReport directory to appear in the OpenShift container.
#Once it appears, it will be copied down to the local instance.  The combination of the parallel execution and the sleep
#in the container facilitate the ability to get the report back down to the running instance.
tar --exclude ./.git --exclude ./src/node_modules -zcf -  ./src | oc run "$1" \
 --image=docker.artifactory.healthpartners.com/platform-tools/hp-nodejs-server-cypress:latest \
 --image-pull-policy=Always \
 --stdin=true --wait=true --restart=Never \
 --command --  bash -c "mkdir src && tar -C ./src -zxvf - --no-same-permissions && cd ./src/src \
 && $npm_commands && sleep 10" & # The ending & sign tells the script to run the command in parallel.

#Delete the contents of the TestReport directory
if [ -d "./TestReport" ]; then
  rm -r ./TestReport
fi

mkdir TestReport

sleep 5

# Wait until we find the 'TestReport' directory on the container.  Once we find it, move on and we will copy the contets
# into the ./report directory.
#directory=''
#while [ -z "$directory" ]; do
#  # Set x to a new value (you can replace this with any command that sets x to a value)
#  echo "looking for directory"
#  directory=$(oc exec "$1" -- ls /opt/app-root/src/src | grep TestReport)
#  #echo "Directory is $directory"
#  sleep 1
#done
#
#echo "Test report created on open-shift pod.  Copying files."
#
## Copy the test resport generated on the pod to the local file system
#oc cp "$1":/opt/app-root/src/src/TestReport ./TestReport
#
#echo "Copying cypress-execution-report.json from OpenShift pod to local"
#
## Copy the cypress-execution-report.json generated on the pod to the local file system
#oc cp "$1":/opt/app-root/src/src/cypress-execution-report.json ./cypress-execution-report.json

#Finally, when we are all finished delete the pod.
oc delete pod "$1"

