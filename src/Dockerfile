FROM envoyproxy/envoy-dev:4ac979915fce8562e49293d8e52a48fc25ec6cf6

COPY ./envoy.yaml /etc/envoy/envoy.yaml

CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml -l trace --log-path /tmp/envoy_info.log --bootstrap-version 3

#RUN chmod go+r /etc/envoy/envoy.yaml