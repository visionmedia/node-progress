
EXAMPLES = $(foreach EXAMPLE, $(wildcard examples/*.js), $(EXAMPLE))
.PHONY: $(EXAMPLES)

.PHONY: test
test: $(EXAMPLES)

$(EXAMPLES): ; node $@ && echo
