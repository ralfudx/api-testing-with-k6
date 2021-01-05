
fails=$(cat output.json | jq '.metrics.checks.fails')
if [[ $fails != 0 ]]; then
  echo "TEST FAILED"
  exit 1
else
  echo "TEST PASSED"
fi


