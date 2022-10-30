for f in ./dives/*; do
  mv $f ./dives/$(uuidgen).json
done
