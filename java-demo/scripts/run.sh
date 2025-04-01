#!/usr/bin/env sh
[[ "_${JAVA_EXTRA_OPTS}" != "_" ]] && JAVA_OPTS="${JAVA_OPTS} ${JAVA_EXTRA_OPTS}"
exec java -XX:+ExitOnOutOfMemoryError ${JAVA_OPTS} -jar app.jar ${@}
