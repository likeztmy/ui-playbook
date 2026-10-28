#!/bin/zsh
# Builds and walks one run at a time, each once the machine is free (1-minute load under 6).
# Reads "<task> <arm> <n>" lines on stdin, e.g. `printf '01 a 1\n01 b 1\n' | eval/batch.sh`.
cd "${0:A:h}/.."
runs=${EVAL_RUNS:-$HOME/code/ui-playbook-eval-runs}
while read -r task arm n; do
  until [[ $(sysctl -n vm.loadavg | awk '{print ($2 < 6)}') == 1 ]]; do sleep 30; done
  echo "$(date +%H:%M) build $task $arm $n"
  node eval/run.mjs $task $arm $n < /dev/null || { echo "$(date +%H:%M) run failed: $task $arm $n"; continue; }
  node eval/walk.mjs $runs/$task*/$arm-$n < /dev/null || echo "$(date +%H:%M) walk failed: $task $arm $n"
done
echo "$(date +%H:%M) batch done"
